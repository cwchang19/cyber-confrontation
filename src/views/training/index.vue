<template>
    <div class="training-container">
        <router-link :to="'/training/add/' + randomStr">
            <el-button type="success" size="small" @click="randomStr = getRandomStr()">
                新增
            </el-button>
        </router-link>
        <router-link :to="'/training/simulation/1'">
            <el-button type="primary" size="small">
                仿真1
            </el-button>
        </router-link>
        <router-link :to="'/training/simulation/2'">
            <el-button type="primary" size="small">
                仿真2
            </el-button>
        </router-link>
    </div>
</template>

<script>
    export default {
        name: 'Training',
        data() {
            return {
                randomStr: this.getRandomStr(),
            }
        },
        methods: {
            getRandomStr() {
                return Math.random().toString(36).slice(-8);
            }
        }
    }
</script>

<style>

</style>