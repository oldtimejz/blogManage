function checkLogin(req, res, next){
    if( !req.session.user ){
        req.flash('error','未登录请先登录');
        return res.redirect('/detail?'+id);
    }
    next();
}
function checkNoLogin(req, res, next){
    if( req.session.user ){
        req.flash('error','已经登录无需再登录');
        return res.redirect('back');
    }
    next();
}

module.exports = {
    checkLogin: checkLogin,
    checkNoLogin: checkNoLogin
}