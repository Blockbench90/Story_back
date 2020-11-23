const passport = require('passport')

passport.use(
    new LocalStrategy (
        async (username, password, done) => {
            try{
                const user = await UserModel.findOne()
            } catch (error) {

            }
        }
    )
)