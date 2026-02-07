import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) =>{
    const token = req.headers.token;

    if(!token){
        return res.json({ success: false, message: 'Not Authorized. Login Again'})
    } 

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if(!tokenDecode.id){
            return res.json({success:false, message: 'Not Authorized. Login Again'})
        }

        req.userId = tokenDecode.id;   // ✅ attach here (safe)

        next();

    } catch (error) {
        res.json({ success:false, message: error.message})
    }
};

export default userAuth;
