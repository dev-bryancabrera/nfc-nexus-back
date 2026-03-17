import { ObtenerCardPublica } from '../../../Cards/application/use-cases/ObtenerCardPublica';
import { CardRepositorySupabase } from '../../../Cards/infrastructure/CardRepositorySupabase';

const cardRepo       = new CardRepositorySupabase();
const obtenerPublica = new ObtenerCardPublica(cardRepo);

export class ServirCard {
  async execute(slug: string) {
    return obtenerPublica.execute(slug);
  }
}
