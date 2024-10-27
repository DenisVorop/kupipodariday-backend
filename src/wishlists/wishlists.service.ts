import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    const newWishlist = this.wishlistRepository.create(createWishlistDto);
    return await this.wishlistRepository.save(newWishlist);
  }

  async findAll(): Promise<Wishlist[]> {
    return await this.wishlistRepository.find();
  }

  async findOne(id: number): Promise<Wishlist | undefined> {
    return await this.wishlistRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    await this.wishlistRepository.update(id, updateWishlistDto);
    return await this.wishlistRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.wishlistRepository.delete(id);
  }
}
