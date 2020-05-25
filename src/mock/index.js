import Mock from 'mockjs'
import decision from './decision'
import menu from './menu'
import route from './route'

Mock.mock(/\/decision\/getName/,'get',decision.getName);
Mock.mock(/\/menu\/getMenu/,'get',menu.getMenu);
Mock.mock(/\/route\/getRoutes/,'get',route.getRoutes);