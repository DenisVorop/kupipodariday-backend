import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto): Promise<Wish> {
    const newWish = this.wishRepository.create(createWishDto);
    return await this.wishRepository.save(newWish);
  }

  async findAll(): Promise<Wish[]> {
    return await this.wishRepository.find();
  }

  async findOne(id: number): Promise<Wish | undefined> {
    return await this.wishRepository.findOne({ where: { id } });
  }

  async update(id: number, updateWishDto: UpdateWishDto): Promise<Wish> {
    await this.wishRepository.update(id, updateWishDto);
    return await this.wishRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.wishRepository.delete(id);
  }

  async findUserWishes(userId: number): Promise<Wish[]> {
    return await this.wishRepository.find({ where: { owner: { id: userId } } });
  }
}
