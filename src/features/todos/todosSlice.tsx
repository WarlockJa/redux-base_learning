import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const URL = 'http://localhost:3500'

interface ITodos {
    userId: number;
    id: string;
    title: string;
    completed: boolean;
}

const initialState: ITodos[] = [
    {
        "userId": 1,
        "id": "82",
        "title": "voluptates eum voluptas et dicta",
        "completed": true
      },
      {
        "userId": 2,
        "id": "83",
        "title": "quidem at rerum quis ex aut sit quam",
        "completed": true
      },
      {
        "userId": 3,
        "id": "84",
        "title": "sunt veritatis ut voluptate",
        "completed": false
      },
      {
        "userId": 4,
        "id": "85",
        "title": "et quia ad iste a",
        "completed": true
      },
      {
        "userId": 5,
        "id": "86",
        "title": "incidunt ut saepe autem",
        "completed": true
      },
      {
        "userId": 6,
        "id": "87",
        "title": "laudantium quae eligendi consequatur quia et vero autem",
        "completed": true
      },
      {
        "userId": 7,
        "id": "88",
        "title": "vitae aut excepturi laboriosam sint aliquam et et accusantium",
        "completed": false
      },
      {
        "userId": 8,
        "id": "89",
        "title": "sequi ut omnis et",
        "completed": true
      },
      {
        "userId": 9,
        "id": "90",
        "title": "molestiae nisi accusantium tenetur dolorem et",
        "completed": true
      }
]

const todosSlice = createSlice({
    name: 'todos',
    initialState: initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<ITodos>) => {
            state.push(action.payload)
        }
    }
})

export const {
    addTodo
} = todosSlice.actions

export default todosSlice.reducer