import { Fonte } from '../fonte';
import { Erro } from '../models/Erro';

export class ItemModel {
  public content: string;
  public fonte: Fonte;
  public errors: Erro[];
}
