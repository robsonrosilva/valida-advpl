export class ProjectStatus {
  protected total: number;
  protected atual: number;

  set _total(total: number) {
    this.total = total;
    if (this._changeEmmit) {
      this._changeEmmit();
    }
  }

  get _total(): number {
    return this.total;
  }

  set _atual(atual: number) {
    this.atual = atual;
    if (this._changeEmmit) {
      this._changeEmmit();
    }
  }

  get _atual(): number {
    return this.atual;
  }

  _changeEmmit: Function;
}
