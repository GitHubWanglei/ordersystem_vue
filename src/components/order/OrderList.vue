<template>
  <div style="100%; padding-right:20px">
    <el-row>
      <h3>订单列表：</h3>
    </el-row>
    <el-row style="min-width: 700px">
      <el-col :span="12">
        <div style="width: 380px">
          <el-input
            v-model.trim="orderId"
            placeholder="请输入订单号"
            style="width: 260px; float: left"
            clearable
            @clear="this.getOrderById"
          />
          <el-button
            size="small"
            color="#173352"
            style="margin-top: 5px; margin-left: 20px: float: left"
            @click="this.getOrderById"
            >查询</el-button
          >
        </div>
      </el-col>
      <el-col :span="8"></el-col>
      <el-col :span="4">
        <div v-if="username != null" style="width: 80px">
          <el-button
            size="small"
            color="#173352"
            style="margin-top: 5px"
            @click="addOrder"
            >添加订单</el-button
          >
        </div>
      </el-col>
    </el-row>
    <br /><br />
    <el-table
      :data="orderList"
      stripe
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column prop="orderId" label="订单号" min-width="150">
        <template v-slot="scope">
          <!-- <span v-if="scope.row.isRed" style="color: red">{{
            scope.row.orderId
          }}</span> -->
          <el-button
            v-if="scope.row.isRed"
            style="color: red"
            link
            @click="detialBtnClick(scope.row)"
            >{{ scope.row.orderId }}</el-button
          >
          <el-button
            v-else
            style="color: #606266"
            link
            @click="detialBtnClick(scope.row)"
            >{{ scope.row.orderId }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="deviceName" label="设备名称" min-width="150" />
      <el-table-column prop="salesMan" label="业务员" width="120" />
      <el-table-column prop="area" label="地区" width="120" />
      <el-table-column prop="designer" label="设计员" width="120" />
      <el-table-column prop="orderStatus" label="订单状态" width="120" />
      <el-table-column prop="orderDate" label="下单日期" width="100" />
      <el-table-column prop="deliveryDate" label="交货日期" width="100" />
      <el-table-column prop="completionDate" label="完工日期" width="100" />
      <el-table-column prop="shipmentDate" label="发货日期" width="100" />
      <el-table-column label="操作" width="150">
        <template v-slot="scope">
          <el-button
            size="small"
            type="primary"
            link
            @click="detialBtnClick(scope.row)"
            >详情</el-button
          >
          <el-button
            v-if="username != null"
            size="small"
            type="primary"
            link
            @click="editBtnClick(scope.row)"
            >修改</el-button
          >
          <el-button
            v-if="username != null"
            size="small"
            type="danger"
            link
            @click="deleteBtnClick(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <br />
    <div class="demo-pagination-block" style="float: right; margin-right: 50px">
      <el-pagination
        :current-page="pageNo"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next"
        :total="total"
        next-text="下一页"
        prev-text="上一页"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      v-model="dialogTableVisible"
      title="生产订单跟踪表"
      width="700px"
      :destroy-on-close="true"
    >
      <vue3-html2pdf
        :show-layout="false"
        :float-layout="true"
        :enable-download="false"
        :preview-modal="true"
        :paginate-elements-by-height="1400"
        :filename="dialogData.orderId"
        :pdf-quality="2"
        :manual-pagination="false"
        pdf-format="a4"
        pdf-orientation="portrait"
        pdf-content-width="800px"
        ref="html2Pdf"
      >
        <template v-slot:pdf-content>
          <el-row style="margin-top: 50px">
            <h3 style="line-height: 100px; text-align: center; width: 100%">
              生产订单跟踪表
            </h3>
          </el-row>
          <div style="padding-left: 70px; padding-right: 70px; width: 100%">
            <el-row style="padding-left: 10px">
              <el-col :span="12">
                <p style="float: left; font-weight: bold">订单号：</p>
                <span style="float: left; color: rgb(95, 93, 93)">{{
                  dialogData.orderId
                }}</span>
              </el-col>
              <el-col :span="12">
                <p style="float: left; font-weight: bold">设备名称：</p>
                <span style="float: left; color: rgb(95, 93, 93)">{{
                  dialogData.deviceName
                }}</span>
              </el-col>
            </el-row>
            <br />
            <el-row style="padding-left: 10px">
              <el-col :span="12">
                <p style="float: left; font-weight: bold">业务员：</p>
                <span
                  style="float: left; lineheight: 20px; color: rgb(95, 93, 93)"
                  >{{ dialogData.salesMan }}</span
                >
              </el-col>
              <el-col :span="12">
                <p style="float: left; font-weight: bold">地区：</p>
                <span
                  style="float: left; lineheight: 20px; color: rgb(95, 93, 93)"
                  >{{ dialogData.area }}</span
                >
              </el-col>
            </el-row>
            <br />
            <el-row style="padding-left: 10px">
              <el-col :span="12">
                <p style="float: left; font-weight: bold">设计员：</p>
                <span
                  style="float: left; lineheight: 20px; color: rgb(95, 93, 93)"
                  >{{ dialogData.designer }}</span
                >
              </el-col>
              <el-col :span="12">
                <p style="float: left; font-weight: bold">数量：</p>
                <span
                  style="float: left; lineheight: 20px; color: rgb(95, 93, 93)"
                  >{{ dialogData.number }}</span
                >
              </el-col>
            </el-row>
            <br />
            <el-row style="padding-left: 10px">
              <el-col :span="12">
                <p style="float: left; font-weight: bold">下单日期：</p>
                <span
                  style="float: left; lineheight: 20px; color: rgb(95, 93, 93)"
                  >{{ dialogData.orderDate }}</span
                >
              </el-col>
              <el-col :span="12">
                <p style="float: left; font-weight: bold">交货日期：</p>
                <span
                  style="float: left; lineheight: 20px; color: rgb(95, 93, 93)"
                  >{{ dialogData.deliveryDate }}</span
                >
              </el-col>
            </el-row>
            <br />
            <el-row style="padding-left: 10px">
              <el-col :span="12">
                <p style="float: left; font-weight: bold">完工日期：</p>
                <span
                  style="float: left; lineheight: 20px; color: rgb(95, 93, 93)"
                  >{{ dialogData.completionDate }}</span
                >
              </el-col>
              <el-col :span="12">
                <p style="float: left; font-weight: bold">发货日期：</p>
                <span
                  style="float: left; lineheight: 20px; color: rgb(95, 93, 93)"
                  >{{ dialogData.shipmentDate }}</span
                >
              </el-col>
            </el-row>
            <br />
            <el-row style="padding-left: 10px">
              <el-col :span="12">
                <p style="float: left; font-weight: bold">订单状态：</p>
                <span
                  style="float: left; lineheight: 20px; color: rgb(95, 93, 93)"
                  >{{
                    dialogData.orderStatus != null
                      ? dialogData.orderStatus
                      : "--"
                  }}</span
                >
              </el-col>
            </el-row>
            <br />
            <el-table
              :data="dialogData.stepList"
              stripe
              style="width: 100%"
              :header-cell-style="{
                background: '#eef1f6',
                color: '#606266',
                fontSize: '12px',
              }"
              width="100%"
            >
              <el-table-column prop="name" label="节点名称" width="80" />
              <el-table-column
                prop="planStartDate"
                label="计划开始时间"
                width="110"
              />
              <el-table-column
                prop="planEndDate"
                label="计划结束时间"
                width="110"
              />
              <el-table-column
                prop="endDate"
                label="实际结束时间"
                width="110"
              />
              <el-table-column prop="expDays" label="超期天数" width="80">
                <template v-slot="scope">
                  <span>{{ scope.row.expDays }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="timeoutReason"
                label="超期原因"
                width="150"
              />
            </el-table>
          </div>
        </template>
      </vue3-html2pdf>
      <div class="dialog-content-container">
        <el-row>
          <el-col :span="12">
            <h4 style="float: left; line-height: 20px">订单号：</h4>
            <span style="float: left; line-height: 20px">{{
              dialogData.orderId
            }}</span>
          </el-col>
          <el-col :span="12">
            <h4 style="float: left; line-height: 20px">设备名称：</h4>
            <span style="float: left; line-height: 20px">{{
              dialogData.deviceName
            }}</span>
          </el-col>
        </el-row>
        <br />
        <el-row>
          <el-col :span="12">
            <h4 style="float: left; line-height: 20px">业务员：</h4>
            <span style="float: left; line-height: 20px">{{
              dialogData.salesMan
            }}</span>
          </el-col>
          <el-col :span="12">
            <h4 style="float: left; line-height: 20px">地区：</h4>
            <span style="float: left; line-height: 20px">{{
              dialogData.area
            }}</span>
          </el-col>
        </el-row>
        <br />
        <el-row>
          <el-col :span="12">
            <h4 style="float: left; line-height: 20px">设计员：</h4>
            <span style="float: left; line-height: 20px">{{
              dialogData.designer
            }}</span>
          </el-col>
          <el-col :span="12">
            <h4 style="float: left; line-height: 20px">数量：</h4>
            <span style="float: left; line-height: 20px">{{
              dialogData.number
            }}</span>
          </el-col>
        </el-row>
        <br />
        <el-row>
          <el-col :span="12">
            <h4 style="float: left; line-height: 20px">下单日期：</h4>
            <span style="float: left; line-height: 20px">{{
              dialogData.orderDate
            }}</span>
          </el-col>
          <el-col :span="12">
            <h4 style="float: left; line-height: 20px">交货日期：</h4>
            <span style="float: left; line-height: 20px">{{
              dialogData.deliveryDate
            }}</span>
          </el-col>
        </el-row>
        <br />
        <el-row>
          <el-col :span="12">
            <h4 style="float: left; line-height: 20px">完工日期：</h4>
            <span style="float: left; line-height: 20px">{{
              dialogData.completionDate
            }}</span>
          </el-col>
          <el-col :span="12">
            <h4 style="float: left; line-height: 20px">发货日期：</h4>
            <span style="float: left; line-height: 20px">{{
              dialogData.shipmentDate
            }}</span>
          </el-col>
        </el-row>
        <br />
        <el-row>
          <el-col :span="12">
            <h4 style="float: left; line-height: 20px">订单状态：</h4>
            <span style="float: left; line-height: 20px">
              {{
                dialogData.orderStatus != null ? dialogData.orderStatus : "--"
              }}
            </span>
          </el-col>
        </el-row>
        <br />
        <el-table
          :data="dialogData.stepList"
          stripe
          style="width: 100%"
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          width="630px"
        >
          <el-table-column prop="name" label="节点名称" width="80" />
          <el-table-column
            prop="planStartDate"
            label="计划开始时间"
            width="110"
          />
          <el-table-column prop="planEndDate" label="计划结束时间" width="110">
            <template v-slot="scope">
              <span v-if="scope.row.isRed" style="color: red">{{
                scope.row.planEndDate
              }}</span>
              <span v-else>{{ scope.row.planEndDate }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="endDate" label="实际结束时间" width="110" />
          <el-table-column prop="expDays" label="超期天数" width="80">
            <template v-slot="scope">
              <span v-if="scope.row.expDays > 0" style="color: red">{{
                scope.row.expDays
              }}</span>
              <span v-else>{{ scope.row.expDays }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="timeoutReason" label="超期原因" width="150" />
        </el-table>
      </div>
      <el-row justify="end">
        <el-button
          size="small"
          color="#173352"
          style="margin-top: 30px"
          @click="exportOrder(dialogData)"
          >导出excel</el-button
        >
        <el-button
          size="small"
          color="#173352"
          style="margin-top: 30px"
          @click="exportPdf"
          >导出pdf</el-button
        >
      </el-row>
    </el-dialog>

    <el-dialog
      v-model="deleteDialogVisible"
      title="提示"
      width="350px"
      height="150px"
      :before-close="this.deleteData == null"
      style="border-radius: 10px"
    >
      <span>删除后, 此订单数据将不可恢复, 确定要删除吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="(this.deleteData = null), (deleteDialogVisible = false)"
            >取消</el-button
          >
          <el-button
            style="background-color: rgb(163, 8, 8); color: white"
            @click="this.confirmDeleteBtnClick"
          >
            确定删除
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getOrders, getOrderById, deleteOrder } from "../../utils/api.js";
import { ElMessage } from "element-plus";
import ExcelJS from "exceljs";
import saveAs from "file-saver";
import Vue3Html2pdf from "vue3-html2pdf";

export default {
  name: "list",
  components: {
    Vue3Html2pdf,
  },
  data() {
    return {
      username: localStorage.getItem("username"),
      dialogTableVisible: false,
      deleteDialogVisible: false,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      orderList: [],
      dialogData: {},
      orderId: null,
      deleteData: null,
    };
  },
  mounted() {
    this.fetchOrderList();
  },
  methods: {
    async fetchOrderList() {
      if (this.pageNo <= 0) {
        this.pageNo = 1;
      }
      await getOrders({
        pageNo: this.pageNo - 1,
        pageSize: this.pageSize,
      })
        .then((response) => {
          if (response.data.code == 0) {
            this.total = response.data.data.total;
            var list = [];
            list = response.data.data.dataList;
            for (let i = 0; i < list.length; i++) {
              let order = list[i];
              order.isRed = false;
              order.orderDate = this.formatTimestamp(order.orderDate);
              order.deliveryDate = this.formatTimestamp(order.deliveryDate);
              order.completionDate = this.formatTimestamp(order.completionDate);
              order.shipmentDate = this.formatTimestamp(order.shipmentDate);
              for (let j = 0; j < order.stepList.length; j++) {
                let step = order.stepList[j];

                step.planStartDate = this.formatTimestamp(step.planStartDate);
                step.planEndDate = this.formatTimestamp(step.planEndDate);
                step.endDate = this.formatTimestamp(step.endDate);

                step.expDays = 0;
                if (step.planEndDate != "--") {
                  var plan_time = new Date(step.planEndDate);
                  plan_time.setUTCHours(0, 0, 0, 0);
                  if (step.endDate != "--") {
                    // 有实际结束时间，与实际结束时间比较
                    var endtime = new Date(step.endDate);
                    endtime.setUTCHours(0, 0, 0, 0);
                    step.isRed = endtime - plan_time > 0;
                    step.expDays =
                      (endtime - plan_time) / (24 * 60 * 60 * 1000);
                  } else {
                    // 有实际结束时间，与当前时间比较
                    var cur_time = new Date(new Date().getTime());
                    cur_time.setUTCHours(0, 0, 0, 0);
                    step.isRed = cur_time - plan_time > 0;
                    step.expDays =
                      (cur_time - plan_time) / (24 * 60 * 60 * 1000);
                  }
                  if (step.isRed == true) {
                    order.isRed = true;
                  }
                } else {
                  step.isRed = false;
                }
                if (step.expDays < 0) {
                  step.expDays = 0;
                }
              }
            }
            this.orderList = list;
          } else {
            ElMessage.error(response.data.message);
          }
        })
        .catch((error) => {
          ElMessage.error(error);
        });
    },

    async getOrderById() {
      if (this.orderId == null || this.orderId.length == 0) {
        this.fetchOrderList();
      } else {
        getOrderById({ orderId: this.orderId })
          .then((response) => {
            if (response.data.code == 0) {
              let order = response.data.data;
              if (order != null) {
                order.orderDate = this.formatTimestamp(order.orderDate);
                order.deliveryDate = this.formatTimestamp(order.deliveryDate);
                order.completionDate = this.formatTimestamp(
                  order.completionDate
                );
                order.shipmentDate = this.formatTimestamp(order.shipmentDate);
                for (let j = 0; j < order.stepList.length; j++) {
                  let step = order.stepList[j];
                  step.planStartDate = this.formatTimestamp(step.planStartDate);
                  step.planEndDate = this.formatTimestamp(step.planEndDate);
                  step.endDate = this.formatTimestamp(step.endDate);
                }
              }
              if (order != null) {
                this.orderList = [order];
              } else {
                this.orderList = [];
              }
              this.total = this.orderList.length;
              this.pageNo = 1;
            } else {
              ElMessage.error(response.data.message);
            }
          })
          .catch((error) => {
            ElMessage.error(error);
          });
      }
    },

    async deleteBtnClick(item) {
      this.deleteData = item;
      this.deleteDialogVisible = true;
    },

    confirmDeleteBtnClick() {
      let data = { orderId: this.deleteData.orderId };
      deleteOrder(data)
        .then((response) => {
          if (response.data.code == 0) {
            this.fetchOrderList();
            this.deleteDialogVisible = false;
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

    addOrder() {
      this.$router.push("/home/add");
    },

    detialBtnClick(item) {
      this.dialogData = item;
      this.dialogTableVisible = true;
    },

    editBtnClick(item) {
      this.$router.push("/home/add?orderId=" + item.orderId);
    },

    exportPdf() {
      this.$refs.html2Pdf.generatePdf();
    },

    exportOrder(order) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(order.orderId);
      worksheet.properties.defaultRowHeight = 40;

      const row_1 = worksheet.getRow(1);
      row_1.height = 50;
      row_1.getCell(1).value = "生产订单跟踪表";
      row_1.getCell(1).font = {
        name: "Comic Sans MS",
        family: 4,
        size: 16,
        bold: true,
      };
      row_1.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
      worksheet.mergeCells("A1:F1");

      const row_2 = worksheet.getRow(2);
      row_2.height = 40;
      row_2.getCell(1).value = "订单号";
      row_2.getCell(2).value = order.orderId;
      worksheet.mergeCells("B2:C2");
      row_2.getCell(4).value = "设备名称";
      row_2.getCell(5).value = order.deviceName;
      worksheet.mergeCells("E2:F2");
      for (let i = 1; i <= 5; i++) {
        row_2.getCell(i).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        row_2.getCell(i).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
      row_2.getCell(1).font = {
        bold: true,
      };
      row_2.getCell(4).font = {
        bold: true,
      };

      const row_3 = worksheet.getRow(3);
      row_3.height = 40;
      row_3.getCell(1).value = "业务员";
      row_3.getCell(2).value = order.salesMan;
      worksheet.mergeCells("B3:C3");
      row_3.getCell(4).value = "地区";
      row_3.getCell(5).value = order.area;
      worksheet.mergeCells("E3:F3");
      for (let i = 1; i <= 6; i++) {
        row_3.getCell(i).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        row_3.getCell(i).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
      row_3.getCell(1).font = {
        bold: true,
      };
      row_3.getCell(4).font = {
        bold: true,
      };

      const row_4 = worksheet.getRow(4);
      row_4.height = 40;
      row_4.getCell(1).value = "设计员";
      row_4.getCell(2).value = order.designer;
      worksheet.mergeCells("B4:C4");
      row_4.getCell(4).value = "数量";
      row_4.getCell(5).value = order.number;
      worksheet.mergeCells("E4:F4");
      for (let i = 1; i <= 6; i++) {
        row_4.getCell(i).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        row_4.getCell(i).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
      row_4.getCell(1).font = {
        bold: true,
      };
      row_4.getCell(4).font = {
        bold: true,
      };

      const row_5 = worksheet.getRow(5);
      row_5.height = 40;
      row_5.getCell(1).value = "下单日期";
      row_5.getCell(2).value = this.convertToExcelDate(order.orderDate);
      worksheet.mergeCells("B5:C5");
      row_5.getCell(4).value = "交货日期";
      row_5.getCell(5).value = this.convertToExcelDate(order.deliveryDate);
      worksheet.mergeCells("E5:F5");
      for (let i = 1; i <= 6; i++) {
        row_5.getCell(i).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        row_5.getCell(i).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
      row_5.getCell(1).font = {
        bold: true,
      };
      row_5.getCell(4).font = {
        bold: true,
      };

      const row_6 = worksheet.getRow(6);
      row_6.height = 40;
      row_6.getCell(1).value = "完工日期";
      row_6.getCell(2).value = this.convertToExcelDate(order.completionDate);
      worksheet.mergeCells("B6:C6");
      row_6.getCell(4).value = "发货日期";
      row_6.getCell(5).value = this.convertToExcelDate(order.shipmentDate);
      worksheet.mergeCells("E6:F6");
      for (let i = 1; i <= 6; i++) {
        row_6.getCell(i).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        row_6.getCell(i).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
      row_6.getCell(1).font = {
        bold: true,
      };
      row_6.getCell(4).font = {
        bold: true,
      };

      const row_7 = worksheet.getRow(7);
      row_7.height = 40;
      worksheet.mergeCells("B7:F7");
      row_7.getCell(1).value = "订单状态";
      row_7.getCell(2).value =
        order.orderStatus != null ? order.orderStatus : "--";
      row_7.getCell(1).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      row_7.getCell(2).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      row_7.getCell(1).font = {
        bold: true,
      };
      row_7.getCell(2).alignment = {
        vertical: "middle",
      };

      const row_8 = worksheet.getRow(8);
      row_8.getCell(1).value = "节点名称";
      row_8.getCell(2).value = "计划开始时间";
      row_8.getCell(3).value = "计划结束时间";
      row_8.getCell(4).value = "实际结束时间";
      row_8.getCell(5).value = "超期天数";
      row_8.getCell(6).value = "超期原因";
      row_8.height = 40;
      for (let i = 1; i <= 6; i++) {
        row_8.getCell(i).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        row_8.getCell(i).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        row_8.getCell(i).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFCCCCCC" },
        };
      }

      for (let i = 0; i < order.stepList.length; i++) {
        const step = order.stepList[i];
        const row = worksheet.getRow(9 + i);
        row.height = 40;
        row.getCell(1).value = step.name;
        row.getCell(2).value = this.convertToExcelDate(step.planStartDate);
        row.getCell(3).value = this.convertToExcelDate(step.planEndDate);
        row.getCell(4).value = this.convertToExcelDate(step.endDate);
        row.getCell(5).value = step.expDays;
        row.getCell(6).value = step.timeoutReason;
        for (let i = 1; i <= 6; i++) {
          row.getCell(i).alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          };
          row.getCell(i).border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        }
      }

      const col_list = ["A", "B", "C", "D", "E", "F"];
      for (let i = 0; i < col_list.length; i++) {
        const col = worksheet.getColumn(col_list[i]);
        col.width = 15;
        if (i == 4) {
          col.width = 10;
        }
        if (i == 5) {
          col.width = 20;
        }
      }

      const EXCEL_TYPE =
        "application/vnd.openxmlformats-officedecument.spreadsheetml.sheet;charset=UTF-8";
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: EXCEL_TYPE });
        saveAs(blob, `${order.orderId}.xlsx`);
      });
    },

    convertToExcelDate(date) {
      if (date != "--") {
        return new Date(date);
      }
      return "";
    },

    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.fetchOrderList();
    },

    handleCurrentChange(pageNo) {
      this.pageNo = pageNo;
      this.fetchOrderList();
    },

    formatTimestamp(timestamp) {
      if (timestamp == null) return "--";
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
  },
};
</script>

<style scoped>
h3 {
  float: left;
  margin-bottom: 30px;
}

::v-deep .dialog-content-container {
  padding-left: 20px;
  overflow: hidden;
  overflow-y: hidden;
  scroll-behavior: auto;
}
</style>
