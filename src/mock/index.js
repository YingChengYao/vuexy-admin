import Mock from 'mockjs'
import route from './route'
import auth from './auth'
//import member from './member'

Mock.mock(/\/route\/getRoutes/,'get',route.getRoutes);
Mock.mock(/\/auth\/login/,'get',auth.requestLogin);
//Mock.mock(/\/api\/integralrecord\/list/,'get',member.getMemberPoints);