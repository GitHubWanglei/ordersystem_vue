import request from "@/utils/request";

export function login(data) {
  return request.post("/login", { ...data });
}

export function register(data) {
  return request.post("/register", { ...data });
}

export function logout(data) {
  return request.post("/logout", { ...data });
}

export function modifyPassword(data) {
  return request.post("/modifyPassword", { ...data });
}

// 获取订单列表
export function getOrders(params) {
  return request({
    method: "GET",
    url: "/order/getAll",
    params: { ...params },
  });
}

// 根据订单号查询订单
export function getOrderById(params) {
  return request({
    method: "GET",
    url: "/order/getOrderByOrderId",
    params: { ...params },
  });
}

// 添加订单
export function addOrder(data) {
  return request.post("/order/save", { ...data });
}

// 编辑订单
export function updateOrder(data) {
  return request.post("/order/update", { ...data });
}

export function deleteOrder(data) {
  return request.post("/order/delete", { ...data });
}
