[toc]

# 四旋翼X型无人机

## 基本原理

### 场景

<img src="images/scene.gif" alt="无法加载" style="zoom:50%;" />

### 模型图

<img src="images/model.png" alt="无法加载" style="zoom: 50%;" />

图中无人机头部在下方，四个规格相同的螺旋桨，其中1，3为逆时针旋转，2，4为顺时针旋转。这样的目的是为了消除反扭矩。后面无人机绕Z轴旋转正是利用了反扭矩。

### 力学分析

螺旋桨的转动，会产生向上的浮力和垂直于螺旋桨所在的连接杆的扭力，二者均正比于转速$\omega$平方。设四个螺旋桨的浮力与扭力分别为$F_1,\ F_2,\ F_3,\ F_4,\ T_1,\ T_2,\ T_3,\ T_4$，无人机重力为$G$。我们有如下的动力学模型
$$
T=C_T\omega^2,\ \ F=C_F\omega^2.
$$
下面我们分析无人机的状态。首先我们假设四个螺旋桨转速相同，且$F=F_1+F_2+F_3+F_4=G$，从而无人机处于**悬浮**状态。下面改变某些螺旋桨的转速。

1. 四者转速增加(减小)相同大小，则无人机**上升(下降)**。
2. 1,4号转速增加(减小)或者2,3号转速减小(增加)相同大小，则无人机**绕Y轴**旋转，而扭力和为0。此时浮力和与重力具有一定夹角，从而会导致无人机**X轴**方向有力，竖直方向可能合力不为0。
3. 1,2号转速增加(减小)或者3,4号转速减小(增加)相同大小，则无人机**绕X轴**旋转，而扭力和为0。同样地，此时浮力和与重力具有一定夹角，从而会导致无人机**Y轴**方向有力，竖直方向可能合力不为0。
4. 1,3号转速增加(减小)，2,4号转速减小(增加)相同大小，则无人机**绕Z轴**旋转，且依然悬浮。

根据上面的分析，无人机绕X或Y轴旋转的同时，也会左右或前后移动。反之亦然。此外，上升(下降)，绕三个轴旋转可以互补影响，即可以只绕X轴旋转而不发生其它三种行为。

## 可视化

这里我们只是简单演示上面的理论推导。因此将问题**简化**：假定除调整姿态以外，螺旋桨固定转速。此外，螺旋桨变速过程时间间隔很短(当然为了方便，我们在演示时将时间拉长)，在此时间段无人机不发生变化。

**pageUp,pageDown**：上下移动。

**方向键左，右：**左右移动。

**方向键上，下：**前后移动。

## Demo
[demo](https://jiandandaoxingfu.github.io/quadrotor).


## 参考资料

1. bilibili：[MATLAB四旋翼无人机系列讲座](https://www.bilibili.com/video/av84538591?p=1).
2. 迪威：[3D模型资源](http://www.3dwhere.com/).
3. CSDN：[QuadrotorFly-四旋翼无人机动力学仿真环境介绍](https://blog.csdn.net/linxiaobo110/article/details/89890970#四旋翼基本动力学模型).

