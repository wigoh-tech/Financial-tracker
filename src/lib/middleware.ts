import helmet from 'helmet';
import cors from 'cors';

export const applySecurity = (req: any, res: any, next: any) => {
  helmet()(req, res, () => {
    cors()(req, res, next);
  });
};
