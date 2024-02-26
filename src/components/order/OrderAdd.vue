<template>
  <div>
    <el-row>
      <h3 v-if="!isEditMode">添加订单：</h3>
      <h3 v-else>修改订单：</h3>
    </el-row>
    <div style="margin-left: 20px">
      <el-row style="min-width: 700px; margin-top: 40px">
        <el-form-item label="订单号:">
          <el-input
            v-model.trim="order.orderId"
            placeholder="请输入订单号"
            style="width: 230px"
            :disabled="isEditMode"
          />
        </el-form-item>
        <el-form-item label="设备名称:" style="margin-left: 50px">
          <el-input
            v-model.trim="order.deviceName"
            placeholder="请输入设备名称"
            style="width: 230px"
          />
        </el-form-item>
      </el-row>
      <el-row style="min-width: 700px">
        <el-form-item label="业务员:">
          <el-input
            v-model.trim="order.salesMan"
            placeholder="请输入业务员名字"
            style="width: 230px"
          />
        </el-form-item>
        <el-form-item
          label="地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;区:"
          style="margin-left: 50px"
        >
          <el-input
            v-model.trim="order.area"
            placeholder="请输入地区"
            style="width: 230px"
          />
        </el-form-item>
      </el-row>
      <el-row style="min-width: 700px">
        <el-form-item label="设计员:">
          <el-input
            v-model.trim="order.designer"
            placeholder="请输入设计员名字"
            style="width: 230px"
          />
        </el-form-item>
        <el-form-item
          label="数&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;量:"
          style="margin-left: 50px"
        >
          <el-input
            v-model.trim="order.number"
            placeholder="请输入数量"
            style="width: 230px"
          />
        </el-form-item>
      </el-row>
      <el-row style="min-width: 700px">
        <el-form-item label="下单日期:">
          <el-date-picker
            v-model="order.orderDate"
            type="date"
            placeholder="下单日期"
            size="default"
            value-format="x"
          />
        </el-form-item>
        <el-form-item label="交货日期:" style="margin-left: 50px">
          <el-date-picker
            v-model="order.deliveryDate"
            type="date"
            placeholder="交货日期"
            size="default"
            value-format="x"
          />
        </el-form-item>
      </el-row>
      <el-row style="min-width: 700px">
        <el-form-item label="完工日期:">
          <el-date-picker
            v-model="order.completionDate"
            type="date"
            placeholder="完工日期"
            size="default"
            value-format="x"
          />
        </el-form-item>
        <el-form-item label="发货日期:" style="margin-left: 50px">
          <el-date-picker
            v-model="order.shipmentDate"
            type="date"
            placeholder="发货日期"
            size="default"
            value-format="x"
          />
        </el-form-item>
      </el-row>
      <el-row style="min-width: 700px">
        <el-form-item label="订单状态:">
          <el-input
            v-model.trim="order.orderStatus"
            placeholder="请输入订单状态"
            style="width: 230px"
          />
        </el-form-item>
      </el-row>

      <el-table
        :data="order.stepList"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        style="width: 820px"
      >
        <el-table-column prop="name" label="节点名称" width="120" />
        <el-table-column prop="name" label="计划开始时间" width="150">
          <template v-slot="scope">
            <el-date-picker
              v-model="scope.row.planStartDate"
              type="date"
              placeholder="计划开始时间"
              size="small"
              value-format="x"
              style="width: 120px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="计划结束时间" width="150">
          <template v-slot="scope">
            <el-date-picker
              v-model="scope.row.planEndDate"
              type="date"
              placeholder="计划结束时间"
              size="small"
              value-format="x"
              style="width: 120px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="实际结束时间" width="150">
          <template v-slot="scope">
            <el-date-picker
              v-model="scope.row.endDate"
              type="date"
              placeholder="实际结束时间"
              size="small"
              value-format="x"
              style="width: 120px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="超期原因" width="250">
          <template v-slot="scope">
            <el-input
              v-model.trim="scope.row.timeoutReason"
              placeholder="超期原因"
            />
          </template>
        </el-table-column>
      </el-table>

      <el-row style="min-width: 700px; margin-top: 50px">
        <el-button
          color="#173352"
          style="width: 80px; margin-left: 250px"
          @click="confirmBtnClick"
          >{{ isEditMode ? "确定修改" : "确定添加" }}</el-button
        >
      </el-row>
    </div>
  </div>
</template>

<script>
import { addOrder, getOrderById, updateOrder } from "../../utils/api.js";
import { ElMessage } from "element-plus";

export default {
  data() {
    return {
      order: {
        orderId: "",
        deviceName: "",
        salesMan: "",
        area: "",
        designer: "",
        number: "1",
        orderDate: "",
        deliveryDate: "",
        completionDate: "",
        shipmentDate: "",
        orderStatus: "",
        stepList: [
          {
            orderId: "",
            sequence: 1,
            name: "机械设计",
            planStartDate: "",
            planEndDate: "",
            endDate: "",
            timeoutReason: "",
          },
          {
            orderId: "",
            sequence: 2,
            name: "电气设计",
            planStartDate: "",
            planEndDate: "",
            endDate: "",
            timeoutReason: "",
          },
          {
            orderId: "",
            sequence: 3,
            name: "物料采购",
            planStartDate: "",
            planEndDate: "",
            endDate: "",
            timeoutReason: "",
          },
          {
            orderId: "",
            sequence: 4,
            name: "机加工",
            planStartDate: "",
            planEndDate: "",
            endDate: "",
            timeoutReason: "",
          },
          {
            orderId: "",
            sequence: 5,
            name: "钣金",
            planStartDate: "",
            planEndDate: "",
            endDate: "",
            timeoutReason: "",
          },
          {
            orderId: "",
            sequence: 6,
            name: "焊接",
            planStartDate: "",
            planEndDate: "",
            endDate: "",
            timeoutReason: "",
          },
          {
            orderId: "",
            sequence: 7,
            name: "装配",
            planStartDate: "",
            planEndDate: "",
            endDate: "",
            timeoutReason: "",
          },
          {
            orderId: "",
            sequence: 8,
            name: "电气调试",
            planStartDate: "",
            planEndDate: "",
            endDate: "",
            timeoutReason: "",
          },
        ],
      },
      isEditMode: false,
    };
  },
  mounted() {
    if (this.$route.query.orderId != null) {
      this.isEditMode = true;
      this.getOrder();
    } else {
      this.isEditMode = false;
    }
  },
  methods: {
    async getOrder() {
      await getOrderById({ orderId: this.$route.query.orderId })
        .then((response) => {
          if (response.data.code == 0) {
            this.order = response.data.data;
          } else {
            ElMessage.error(response.data.message);
          }
        })
        .catch((err) => {
          ElMessage.error(err);
        });
    },

    valideOrderData() {
      if (this.order.orderId == null || this.order.orderId.length == 0) {
        ElMessage.error("请输入订单号");
        return false;
      }
      if (this.order.deviceName == null || this.order.deviceName.length == 0) {
        ElMessage.error("请输入设备名称");
        return false;
      }
      if (this.order.number == null || this.order.number.length == 0) {
        ElMessage.error("请输入数量");
        return false;
      }
      if (isNaN(this.order.number)) {
        ElMessage.error("数量必须为数字");
        return false;
      }
      if (parseInt(this.order.number) < 0) {
        ElMessage.error("数量必须大于0");
        return false;
      }
      return true;
    },

    async confirmBtnClick() {
      if (!this.valideOrderData()) {
        return;
      }

      for (var i = 0; i < this.order.stepList.length; i++) {
        this.order.stepList[i].orderId = this.order.orderId;
        this.order.stepList[i].sequence = i + 1;
      }

      if (this.isEditMode) {
        this.updateOrder();
        return;
      }

      await addOrder(this.order)
        .then((response) => {
          if (response.data.code == 0) {
            this.$router.push("/home");
            ElMessage({
              showClose: true,
              message: "保存成功",
              type: "success",
            });
          } else {
            ElMessage.error(response.data.message);
          }
        })
        .catch((err) => {
          ElMessage.error(err);
        });
    },

    async updateOrder() {
      if (!this.valideOrderData()) {
        return;
      }

      await updateOrder(this.order)
        .then((response) => {
          if (response.data.code == 0) {
            this.$router.push("/home");
            ElMessage({
              showClose: true,
              message: response.data.message,
              type: "success",
            });
          } else {
            ElMessage.error(response.data.message);
          }
        })
        .catch((err) => {
          ElMessage.error(err);
        });
    },
  },
};
</script>
