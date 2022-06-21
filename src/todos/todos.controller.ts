import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    const { title, content, authorEmail } = createTodoDto;

    return this.todosService.createTodo({
      title,
      content,
      author: {
        connect: { email: authorEmail },
      },
    });
  }

  @Get()
  findAll() {
    return this.todosService.todos({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todosService.todo({ id: Number(id) });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.updateTodo({
      where: { id: Number(id) },
      data: updateTodoDto,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todosService.deleteTodo({ id: Number(id) });
  }
}
