import Mock from "mockjs";
import route from "./route";
import auth from "./auth";
//import package1 from "./package";

Mock.mock(/\/route\/getRoutes/, "get", route.getRoutes);
Mock.mock(/\/api\/login/, "post", auth.requestLogin);