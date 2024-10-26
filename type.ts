export interface Task {
    id: string;
    title: string;
    detail: string;
    status: Status;
    userId: string;
    createdAt: Date; 
    updateAt: Date; 
  }




export enum Status {
    Pending = 'pending',
    InProgress = 'in-progress',
    Completed = 'completed',
}