<template>
  <div class="bg-container">
    <el-row style="justify-content: center">
      <div class="login-container">
        <el-row style="margin-top: 20px">
          <h2 style="text-align: center; width: 100%">生产订单管理系统</h2>
        </el-row>

        <el-row class="inputDeep" style="padding: 10px; margin-top: 30px">
          <el-input
            v-model.trim="username"
            placeholder="请输入用户名"
            clearable
          />
        </el-row>
        <el-row class="inputDeep" style="padding: 10px">
          <el-input
            v-model.trim="password"
            placeholder="请输入密码"
            clearable
          />
        </el-row>
        <el-row style="justify-content: center; margin-top: 20px">
          <el-button
            style="width: 80px; background-color: #173352; color: white"
            @click="this.loginBtnClick"
            >登录</el-button
          >
          <el-button
            style="width: 80px; background-color: #173352; color: white"
            @click="this.registerBtnClick"
            >注册</el-button
          >
        </el-row>
      </div>
    </el-row>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import { login, register } from "../utils/api.js";
import { JSEncrypt } from "jsencrypt";

export default {
  data() {
    return {
      username: "",
      password: "",
      privateKey: `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDJrOS4YoIg+SZ5CjiZbSgc6d38
rPxT6qhnknYyc/wV3DU0/Uxy8i65GOWweboad0pHiPza45+9CO0smlML8Hgw5Uxo
Ky5pyIGp9K5GwKJ6CNd+x4H5KSaiuT/ZSHUL4GiEsPzXdAYQ+t127aMqX2O8m2IK
rj4+SQYq8LqzGj2q4wIDAQAB`,
    };
  },
  methods: {
    async loginBtnClick() {
      if (this.username.length == 0 || this.password.length == 0) {
        ElMessage.error("用户名、密码不能为空!");
        return;
      }
      let encryptor = new JSEncrypt();
      encryptor.setPublicKey(this.privateKey);
      await login({
        username: encryptor.encrypt(this.username),
        password: encryptor.encrypt(this.password),
      })
        .then((response) => {
          if (response.data.code == 0) {
            localStorage.setItem("username", this.username);
            localStorage.setItem("token", response.data.data);
            this.$router.push("/home");
          } else {
            ElMessage.error(response.data.message);
          }
        })
        .catch((error) => {
          ElMessage.error(error);
        });
    },
    async registerBtnClick() {
      if (this.username.length == 0 || this.password.length == 0) {
        ElMessage.error("用户名、密码不能为空!");
        return;
      }
      if (this.username.length < 2) {
        ElMessage.error("用户名长度不能小于2!");
        return;
      }
      if (this.password.length < 6) {
        ElMessage.error("密码长度不能小于6!");
        return;
      }
      let encryptor = new JSEncrypt();
      encryptor.setPublicKey(this.privateKey);
      await register({
        username: encryptor.encrypt(this.username),
        password: encryptor.encrypt(this.password),
      })
        .then((response) => {
          if (response.data.code == 0) {
            ElMessage({
              showClose: true,
              message: "注册成功，请登录!",
              type: "success",
            });
            this.username = "";
            this.password = "";
          } else {
            ElMessage.error(response.data.message);
          }
        })
        .catch((error) => {
          ElMessage.error(error);
        });
    },
  },
};
</script>

<style scoped>
.bg-container {
  height: 100vh;
  background: rgb(47, 53, 78);
}

.login-container {
  width: 400px;
  height: 260px;
  background-color: rgb(231, 229, 227);
  border-radius: 12px;
  padding: 20px;
  margin-top: 150px;
}
</style>
