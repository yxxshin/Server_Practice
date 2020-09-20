var express = require('express');
var router = express.Router();


let UserModel = require('../models/user');
let util = require('../modules/util');
let statusCode = require('../modules/statusCode');
let resMessage = require('../modules/responseMessage');


/* 
    ✔️ sign up
    METHOD : POST
    URI : localhost:3000/user/signup
    REQUEST BODY : id, name, password, email
    RESPONSE STATUS : 200 (OK)
    RESPONSE DATA : User ID
*/

// 1단계
// router.post('/signup', async (req, res) => {
//     const { id, name, password, email } = req.body;
//     UserModel.push({id, name, password, email});
//     res.status(200).send(UserModel);
// });

// 2단계
// router.post('/signup', async (req, res) => {
//     const { id, name, password, email } = req.body;
//     // request data 확인 - 없다면 Bad Request 반환
//     if ( !id || !name || !password || !email ) {
//         return res.status(400).send({ message: 'BAD REQUEST' });
//     }
//     //already ID
//     if (UserModel.filter(user => user.id == id).length > 0) {
//         return res.status(400).send({ message: 'ALREADY ID' });
//     }
//     UserModel.push({id, name, password, email});
//     res.status(200).send(UserModel);
// });

// 3단계
router.post('/signup', async (req, res) => {
    const {
        id,
        name,
        password,
        email
    } = req.body;
    // request data 확인 - 없다면 Null Value 반환
    if (!id || !name || !password || !email) {
        res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        return;
    }
    //already ID
    if (UserModel.filter(user => user.id == id).length > 0) {
        res.status(statusCode.BAD_REQUEST)
            .send(util.fail(statusCode.BAD_REQUEST, resMessage.ALREADY_ID));
        return;
    }
    UserModel.push({
        id,
        name,
        password,
        email
    });
    res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.CREATED_USER, {
            userId: id
        }));
});

/* 
    ✔️ sign in
    METHOD : POST
    URI : localhost:3000/user/signin
    REQUEST BODY : id, password
    RESPONSE STATUS : 200 (OK)
    RESPONSE DATA : User ID
*/


router.post('/signin', async (req, res) => {
    // request body 에서 데이터 가져오기
    const { id, password } = req.body;

    // request data 확인 - 없다면 Null Value 반환
    if( !id || !password ) {
        res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.LOGIN_FAIL));
    }

    // 존재하는 아이디인지 확인 - 없다면 No user 반환
    if( UserModel.filter( user => user.id == id).length === 0){
        res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
    }

    // 비밀번호 확인 - 없다면 Miss match password 반환
    const login_user = UserModel.filter( user => user.id == id)[0];
    if( login_user.password !== password ) {
        res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.MISS_MATCH_PW));
    }

    // 성공 - login success와 함께 user ID 반환
    res.status(statusCode.OK)
    .send(util.success(statusCode.OK, resMessage.LOGIN_SUCCESS, { userId: id }));

});


/* 
    ✔️ get profile
    METHOD : GET
    URI : localhost:3000/user/profile/:id
    RESPONSE STATUS : 200 (OK)
    RESPONSE DATA : User Id, name, email
*/

router.get('/profile/:id', async (req, res) => {
    // request params 에서 데이터 가져오기
    const id = req.params.id;

    // 존재하는 아이디인지 확인 - 없다면 No user 반환
    if( UserModel.filter( user => user.id == id).length === 0) {
        res.status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_USER));
    }

    // 성공 - login success와 함께 user Id, name, email 반환
    const this_user = UserModel.filter( user => user.id == id)[0];
    res.status(statusCode.OK)
    .send(util.success(statusCode.OK, resMessage.READ_PROFILE_SUCCESS, { userId: this_user.id, name: this_user.name, email: this_user.email}))

});

module.exports = router;