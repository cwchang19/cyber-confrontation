<template>
    <div class="training-container">
        <router-link :to="'/training/add/1'">
            <el-button type="success" size="small">
                新增1
            </el-button>
        </router-link>
        <router-link :to="'/training/add/2'">
            <el-button type="success" size="small">
                新增2
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
    }
</script>

<style>

</style>