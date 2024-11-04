import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { PasswordSanitizerInterceptor } from 'src/interceptors/password.interceptor';

@UseInterceptors(PasswordSanitizerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  create(@Req() req: { user: User }, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(createWishDto, req.user);
  }

  @Get()
  findAll() {
    return this.wishesService.findAll();
  }

  @Get('/last')
  findLastWishes() {
    return this.wishesService.findLastWishes();
  }

  @Get('/top')
  findTopWishes() {
    return this.wishesService.findTopWishes();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req: { user: User },
  ) {
    return this.wishesService.update(+id, updateWishDto, req.user);
  }

  @Delete(':id')
  remove(@Req() req: { user: User }, @Param('id') id: string) {
    return this.wishesService.remove(+id, req.user);
  }

  @Post(':id/copy')
  copyWish(@Param('id') id: string, @Req() req: { user: User }) {
    return this.wishesService.copyWish(+id, req.user);
  }
}
