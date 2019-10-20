export enum WorkerMessageEnum {

  SHARED_BUFFER_SNAPSHOT,
  SHARED_BUFFER_UPDATE

}

export class WorkerMessage {
  public msgType: WorkerMessageEnum;
  public payLoad: any;
}
