const isAuthenticated = (req,res,next) => {
    if (req.session.user.displayName === undefined){
        return res.status(401).json("You do not have access man.");
    }
    next();
}

module.exports = {
    isAuthenticated
}