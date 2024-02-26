<template>
  <div class="common-layout">
    <el-container class="container">
      <el-header>
        <p class="title">生产订单管理系统</p>
        <div style="float: right; width: 50px; height: 30px"></div>
        <el-dropdown
          v-if="username != null"
          @command="handleCommand"
          style="margin-top: 17px; color: white; float: right; hover: none"
        >
          <span class="el-dropdown-link" style="color: white">
            {{ username }}
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="modifyPassword"
                >修改密码</el-dropdown-item
              >
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button
          v-else
          @click="this.loginBtnClick"
          style="
            background: transparent !important;
            color: white;
            border: none;
            border-bottom: 1px;
            margin-top: 8px;
            float: right;
            font-size: 14px;
          "
          >登录</el-button
        >
      </el-header>
      <el-container class="inner-container">
        <el-aside>
          <el-menu
            router
            active-text-color="#ffd04b"
            background-color="#173352"
            class="el-menu-vertical-demo"
            :default-active="this.$route.fullPath"
            text-color="#fff"
          >
            <el-menu-item index="/home">
              <el-icon><List /></el-icon>
              <span>订单列表</span>
            </el-menu-item>
            <el-menu-item
              :index="
                this.$route.fullPath != '/home'
                  ? this.$route.fullPath
                  : '/home/add'
              "
              v-if="username != null"
            >
              <el-icon v-if="$route.query.orderId == null"
                ><DocumentAdd
              /></el-icon>
              <el-icon v-else><Edit /></el-icon>
              <span>{{
                this.$route.query.orderId == null ? "添加订单" : "修改订单"
              }}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

    <el-dialog
      v-model="this.modifyPasswordDialogVisible"
      title="修改密码"
      width="350px"
      height="150px"
      style="border-radius: 10px"
      :before-close="this.beforeClose"
    >
      <div style="margin-left: 20px">
        <el-row>
          <el-form-item label="旧密码:" style="width: 260px">
            <el-input
              v-model.trim="this.oldPassword"
              placeholder="请输入旧密码"
            />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="新密码:" style="width: 260px">
            <el-input
              v-model.trim="this.newPassword"
              placeholder="请输入新密码"
            />
          </el-form-item>
        </el-row>
      </div>

      <div style="justify-content: center; margin-top: 10px">
        <span class="dialog-footer" style="justify-content: center">
          <el-button
            style="background-color: #173352; color: white; width: 100px"
            @click="this.confirmModifyBtnClick"
          >
            确定
          </el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { List, DocumentAdd, Edit, ArrowDown } from "@element-plus/icons-vue";
import { logout, modifyPassword } from "@/utils/api";
import { ElMessage } from "element-plus";
import { JSEncrypt } from "jsencrypt";

export default {
  components: {
    List,
    DocumentAdd,
    Edit,
    ArrowDown,
  },
  data() {
    return {
      username: localStorage.getItem("username"),
      modifyPasswordDialogVisible: false,
      oldPassword: "",
      newPassword: "",
      privateKey: `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDJrOS4YoIg+SZ5CjiZbSgc6d38
rPxT6qhnknYyc/wV3DU0/Uxy8i65GOWweboad0pHiPza45+9CO0smlML8Hgw5Uxo
Ky5pyIGp9K5GwKJ6CNd+x4H5KSaiuT/ZSHUL4GiEsPzXdAYQ+t127aMqX2O8m2IK
rj4+SQYq8LqzGj2q4wIDAQAB`,
    };
  },
  methods: {
    async handleCommand(command) {
      if (command == "logout") {
        await logout({ username: this.username });
        localStorage.clear();
        this.$router.push("/login");
      } else if (command == "modifyPassword") {
        this.modifyPasswordDialogVisible = true;
      }
    },
    loginBtnClick() {
      this.$router.push("/login");
    },
    async confirmModifyBtnClick() {
      if (this.oldPassword == null || this.oldPassword.length == 0) {
        ElMessage.error("请输入旧密码");
        return;
      }
      if (this.newPassword == null || this.newPassword.length == 0) {
        ElMessage.error("请输入新密码");
        return;
      }
      if (this.newPassword.length < 6) {
        ElMessage.error("密码不能少于6位");
        return;
      }
      if (this.oldPassword == this.newPassword) {
        ElMessage.error("新密码与旧密码不能相同, 请更换密码");
        return;
      }

      let encryptor = new JSEncrypt();
      encryptor.setPublicKey(this.privateKey);
      await modifyPassword({
        username: encryptor.encrypt(this.username),
        password: encryptor.encrypt(this.oldPassword),
        newPassword: encryptor.encrypt(this.newPassword),
      })
        .then((response) => {
          if (response.data.code == 0) {
            localStorage.clear();
            logout({ username: this.username });
            this.oldPassword = "";
            this.newPassword = "";
            this.$router.push("/login");
            ElMessage({
              showClose: true,
              message: response.data.message,
              type: "success",
            });
          } else {
            ElMessage.error(response.data.message);
          }
        })
        .catch((error) => {
          ElMessage.error(error);
        });
    },
    beforeClose() {
      this.modifyPasswordDialogVisible = false;
      this.oldPassword = "";
      this.newPassword = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}

.inner-container {
  height: 100%;
  background-color: #173352;
}

.el-header {
  padding: 0;
  padding-left: 20px;
  height: 50px;
  background-color: #141b24;
}
.title {
  font-size: 20px;
  font-weight: bold;
  color: rgb(241, 235, 235);
  float: left;
  line-height: 50px;
}
.el-aside {
  width: 120px;
  padding-left: 10px;
  height: 100vh;
  background-color: #173352;
  .el-menu {
    padding-top: 20px;
    height: 100vh;
    border-right: 0px;
    .el-menu-item {
      padding-left: 0;
      margin: 0;
    }
  }
}
.el-main {
  height: 100vh;
  background-color: white;
}

::deep.el-dropdown {
  --el-menu-hover-bg-color: none;
}
</style>
