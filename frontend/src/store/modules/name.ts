import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../'

// 为 slice state 定义一个类型
interface CounterState {
    card1: [],
    card2: [],
    card3: [],
    card4: [],
    card5: [],
}

// 使用该类型定义初始 state
const initialState: CounterState = {
    card1: [],
    card2: [],
    card3: [],
    card4: [],
    card5: [],
}

export const counterSlice = createSlice({
    name: 'name',
    // `createSlice` 将从 `initialState` 参数推断 state 类型
    initialState,
    reducers: {
       
     
    }
})

// 选择器等其他代码可以使用导入的 `RootState` 类型
export const selectCount = (state: RootState) => state.name

export default counterSlice.reducer