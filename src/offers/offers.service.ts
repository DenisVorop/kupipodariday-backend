import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

  async create(createOfferDto: CreateOfferDto): Promise<Offer> {
    const newOffer = this.offerRepository.create(createOfferDto);
    return await this.offerRepository.save(newOffer);
  }

  async findAll(): Promise<Offer[]> {
    return await this.offerRepository.find();
  }

  async findOne(id: number): Promise<Offer | undefined> {
    return await this.offerRepository.findOne({ where: { id } });
  }

  async update(id: number, updateOfferDto: UpdateOfferDto): Promise<Offer> {
    await this.offerRepository.update(id, updateOfferDto);
    return await this.offerRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.offerRepository.delete(id);
  }
}
