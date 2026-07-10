import { Injectable } from '@nestjs/common';

@Injectable()
export class RandomService {
  int(maxExclusive: number): number {
    return Math.floor(Math.random() * maxExclusive);
  }
}
