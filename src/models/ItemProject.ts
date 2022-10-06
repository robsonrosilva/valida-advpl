import { Fonte } from '../fonte';
import { Erro } from '../models/Erro';

export class ItemModel {
  public hash: string;
  public fonte: Fonte;
  public errors: Erro[];
}
