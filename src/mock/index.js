import Mock from 'mockjs'
import route from './route'
import auth from './auth'

Mock.mock(/\/route\/getRoutes/,'get',route.getRoutes);
Mock.mock(/\/auth\/login/,'get',auth.requestLogin);