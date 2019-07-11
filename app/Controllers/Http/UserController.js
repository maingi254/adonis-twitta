'use strict'
const User= use('App/Models/User')
class UserController {
  async signup({request, response, auth}){
    const userData= request.only(['name','username','email','password'])
    try{
      const user= await User.create(userData)
      const token=await auth.generate(user)
      return response.json({
        status:'success',
        data:token
      })
    }catch(error){
      return response.status(400).json({
        status:'error',
        message:'there was a problem creating the user ,please try again later'
      })
    }

  }
  async login({request,auth ,response}){
    try {
      const token=await auth.attempt(
        request.input('email'),
        request.input('password')

      )
      return response.json({
        status:'success',
        data:token
      })
    } catch (error) {
      response.status(400).json({
        status:'error',
        message:'invalid email / password'
      })
    }
  }


  async me({auth, response}){
    const user=await User.query()
      .where('id',auth.current.user.id)
      .with('tweets', builder=>{
        builder.with('user')
        builder.with('favorites')
        builder.with('replies')
      })
      .with('following')
      .with('followers')
      .with('favorites')
      .with('favorites.tweet',builder=>{
        builder.with('user')
        builder.with('favorites')
        builder.with('replies')
      })
      .firstOrFail()

      return response.json({
        status:'success',
        data:user
      })
  }
}

module.exports = UserController
