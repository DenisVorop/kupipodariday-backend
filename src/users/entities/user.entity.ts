import { IsEmail, IsUrl, Length } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(2, 30)
  username: string;

  @Column({
    nullable: true,
    default: 'Пока ничего не рассказал о себе',
  })
  @Length(2, 200)
  about: string;

  @Column({
    nullable: true,
    default: 'https://i.pravatar.cc/300',
  })
  @IsUrl()
  avatar: string;

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @ManyToMany(() => Offer, (offer) => offer.user)
  @JoinTable()
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlists: Wishlist[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
