import { ObjectId } from 'mongodb';

export interface Bill {
  _id?: ObjectId;
  title: string;
  content: string;
  summary?: string;
  sectors?: string[];
  status: 'pending' | 'active' | 'passed' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface Resource {
  _id?: ObjectId;
  title: string;
  description: string;
  type: 'PDF' | 'Video' | 'Infographic' | 'Article';
  url: string;
  tags?: string[];
  offlineAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contribution {
  _id?: ObjectId;
  billId: ObjectId;
  content: string;
  type: 'url' | 'document' | 'description';
  authorId: ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
} 