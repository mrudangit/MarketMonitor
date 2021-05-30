export enum WorkerMessageEnum {

  SHARED_BUFFER_SNAPSHOT,
  SHARED_BUFFER_UPDATE,
  MB_PER_SECOND

}

export class WorkerMessage {
  public msgType: WorkerMessageEnum;
  public payLoad: any;
}
