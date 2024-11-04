import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, owner: User): Promise<Wish> {
    const newWish = this.wishRepository.create({
      ...createWishDto,
      owner: { id: owner.id },
    });
    return await this.wishRepository.save(newWish);
  }

  async findAll(): Promise<Wish[]> {
    return await this.wishRepository.find();
  }

  async findOne(id: number): Promise<Wish | undefined> {
    return await this.wishRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  async update(
    id: number,
    updateWishDto: UpdateWishDto,
    user: User,
  ): Promise<Wish> {
    const wish = await this.findOne(id);

    if (wish.owner.id !== user.id) {
      throw new Error('Недостаточно прав для редактирования');
    }

    await this.wishRepository.update(id, updateWishDto);
    return await this.wishRepository.findOne({ where: { id } });
  }

  async remove(id: number, user: User): Promise<Wish> {
    const wish = await this.findOne(id);

    if (wish.owner.id !== user.id) {
      throw new Error('Недостаточно прав для удаления');
    }

    await this.wishRepository.delete(id);

    return wish;
  }

  async findUserWishes(userId: number): Promise<Wish[]> {
    return await this.wishRepository.find({ where: { owner: { id: userId } } });
  }

  async copyWish(id: number, user: User): Promise<Wish> {
    const wish = await this.findOne(id);

    if (!wish) {
      throw new Error('Такого подарка не существует');
    }

    const wishData: CreateWishDto = {
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
    };

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const insertedWish = await queryRunner.manager.insert(Wish, {
        ...wishData,
        owner: user,
        offers: [],
      });

      wish.copied += 1;
      await queryRunner.manager.save(wish);

      await queryRunner.commitTransaction();

      return await this.findOne(insertedWish.identifiers[0].id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  findLastWishes() {
    return this.wishRepository.find({
      relations: {
        owner: true,
        offers: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 10,
    });
  }

  findTopWishes() {
    return this.wishRepository.find({
      relations: {
        owner: true,
        offers: true,
      },
      order: {
        copied: 'DESC',
      },
      take: 10,
    });
  }
}
