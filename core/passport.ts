import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTstrategy, ExtractJwt } from 'passport-jwt';
import { UserModel, UserModelInterface } from '../models/UserModel';
import { generateMD5 } from '../utils/generateHash';

passport.use(
  new LocalStrategy(
    async (username, password, done): Promise<void> => {
      try {
        const user = await UserModel.findOne({ $or: [{ email: username }, { username }] }).exec();

        if (!user) {
          return done(null, false);
        }
        //user.confirmed && не забыть вставить в сравнение, когда на строю фронт, чтобы прилетало
          //true, мол верифицирован, и дать добро на вход
        if (user.confirmed && user.password === generateMD5(password + process.env.SECRET_KEY)) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (error) {
        done(error, false);
      }
    },
  ),
);

passport.use(
  new JWTstrategy(
      //предаю ключ для шифрования и в хедерах токен
    {
      secretOrKey: process.env.SECRET_KEY || '123',
      jwtFromRequest: ExtractJwt.fromHeader('token'),
    },
    async (payload: { data: UserModelInterface }, done): Promise<void> => {
      try {
          //если ключ подошел, и токен расшифрован, ищу пользователя по id
        const user = await UserModel.findById(payload.data._id).exec();
        //если все прошло успешно, и пользователь найден, возвращаю
        if (user) {
          return done(null, user);
        }
        //а иначе ничего
        done(null, false);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);

passport.serializeUser((user: UserModelInterface, done) => {
  done(null, user?._id);
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id, (err, user) => {
    done(err, user);
  });
});

export { passport };
