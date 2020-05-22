import Mock from 'mockjs'
import decision from './decision'
import menu from './menu'

Mock.mock(/\/decision\/getName/,'get',decision.getName);
Mock.mock(/\/menu\/getMenu/,'get',menu.getMenu);