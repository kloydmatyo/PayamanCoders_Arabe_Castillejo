import amqp from 'amqplib';

let connection: any = null;
let channel: any = null;

export const QUEUES = {
  EMAIL: 'email_queue',
  STUDENT_SYNC: 'student_sync_queue',
  ASSESSMENT_SCORING: 'assessment_scoring_queue',
  NOTIFICATIONS: 'notifications_queue',
  REPORTS: 'reports_queue',
} as const;

export async function getRabbitMQConnection(): Promise<any> {
  if (!connection) {
    const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    
    try {
      const conn = await amqp.connect(rabbitUrl);
      connection = conn;
      
      connection.on('error', (err: Error) => {
        console.error('RabbitMQ Connection Error:', err);
        connection = null;
        channel = null;
      });

      connection.on('close', () => {
        console.log('RabbitMQ Connection Closed');
        connection = null;
        channel = null;
      });

      console.log('RabbitMQ Connected');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  return connection;
}

export async function getRabbitMQChannel(): Promise<any> {
  if (!channel) {
    const conn = await getRabbitMQConnection();
    channel = await conn.createChannel();
    
    // Declare all queues
    for (const queueName of Object.values(QUEUES)) {
      await channel.assertQueue(queueName, {
        durable: true, // Survive broker restarts
      });
    }

    console.log('RabbitMQ Channel Created');
  }

  return channel;
}

export interface JobPayload<T = any> {
  id: string;
  type: string;
  data: T;
  createdAt: string;
  retries?: number;
}

export const queue = {
  async publish<T>(queueName: string, payload: JobPayload<T>): Promise<boolean> {
    try {
      const ch = await getRabbitMQChannel();
      const message = JSON.stringify(payload);
      
      return ch.sendToQueue(queueName, Buffer.from(message), {
        persistent: true, // Survive broker restarts
      });
    } catch (error) {
      console.error('Queue publish error:', error);
      return false;
    }
  },

  async consume<T>(
    queueName: string,
    handler: (payload: JobPayload<T>) => Promise<void>
  ): Promise<void> {
    try {
      const ch = await getRabbitMQChannel();
      
      await ch.consume(
        queueName,
        async (msg: any) => {
          if (!msg) return;

          try {
            const payload: JobPayload<T> = JSON.parse(msg.content.toString());
            await handler(payload);
            ch.ack(msg); // Acknowledge successful processing
          } catch (error) {
            console.error('Queue consume error:', error);
            // Reject and requeue the message
            ch.nack(msg, false, true);
          }
        },
        { noAck: false }
      );

      console.log(`Consuming from queue: ${queueName}`);
    } catch (error) {
      console.error('Queue consume setup error:', error);
      throw error;
    }
  },

  async getQueueInfo(queueName: string): Promise<{ messageCount: number; consumerCount: number }> {
    try {
      const ch = await getRabbitMQChannel();
      const info = await ch.checkQueue(queueName);
      return {
        messageCount: info.messageCount,
        consumerCount: info.consumerCount,
      };
    } catch (error) {
      console.error('Queue info error:', error);
      return { messageCount: 0, consumerCount: 0 };
    }
  },

  async purgeQueue(queueName: string): Promise<boolean> {
    try {
      const ch = await getRabbitMQChannel();
      await ch.purgeQueue(queueName);
      return true;
    } catch (error) {
      console.error('Queue purge error:', error);
      return false;
    }
  },
};

// Helper functions for specific job types
export const jobs = {
  async sendEmail(emailData: {
    to: string;
    subject: string;
    body: string;
    template?: string;
  }): Promise<boolean> {
    return queue.publish(QUEUES.EMAIL, {
      id: `email-${Date.now()}`,
      type: 'send_email',
      data: emailData,
      createdAt: new Date().toISOString(),
    });
  },

  async syncStudents(syncData: {
    source: string;
    batchSize?: number;
  }): Promise<boolean> {
    return queue.publish(QUEUES.STUDENT_SYNC, {
      id: `sync-${Date.now()}`,
      type: 'sync_students',
      data: syncData,
      createdAt: new Date().toISOString(),
    });
  },

  async scoreAssessment(assessmentData: {
    assessmentId: string;
    userId: string;
    answers: any[];
  }): Promise<boolean> {
    return queue.publish(QUEUES.ASSESSMENT_SCORING, {
      id: `assessment-${Date.now()}`,
      type: 'score_assessment',
      data: assessmentData,
      createdAt: new Date().toISOString(),
    });
  },

  async sendNotification(notificationData: {
    userId: string;
    type: string;
    message: string;
    data?: any;
  }): Promise<boolean> {
    return queue.publish(QUEUES.NOTIFICATIONS, {
      id: `notification-${Date.now()}`,
      type: 'send_notification',
      data: notificationData,
      createdAt: new Date().toISOString(),
    });
  },

  async generateReport(reportData: {
    reportType: string;
    userId: string;
    parameters: any;
  }): Promise<boolean> {
    return queue.publish(QUEUES.REPORTS, {
      id: `report-${Date.now()}`,
      type: 'generate_report',
      data: reportData,
      createdAt: new Date().toISOString(),
    });
  },
};

export default queue;
