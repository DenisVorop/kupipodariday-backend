import { IsUrl, Length } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(1, 250)
  name: string;

  @Column({ length: 1500, nullable: true })
  description: string;

  @Column({ nullable: true })
  @IsUrl()
  image: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
