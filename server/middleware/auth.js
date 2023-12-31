import jwt from "jsonwebtoken";



// wants to like a post
// click the like  button => auth middleware (next) => like controller...

const secret = 'test';

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500;

        let decodedData;

        if (token && isCustomAuth) {      
        decodedData = jwt.verify(token, secret);

        req.userId = decodedData?.id;
        } else {
        decodedData = jwt.decode(token);

        req.userId = decodedData?.sub;
        }    

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({message: 'Token expired'});
        }
        console.log(error);
        return res.status(500).json({message: 'Internal Server Error'});
    }
};

export default auth;