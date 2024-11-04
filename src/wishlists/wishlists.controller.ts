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
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(
    @Req() req: { user: User },
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    return this.wishlistsService.create(createWishlistDto, req.user);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.wishlistsService.findOneById(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: { user: User },
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.update(+id, updateWishlistDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: { user: User }) {
    return this.wishlistsService.remove(+id, req.user);
  }
}
