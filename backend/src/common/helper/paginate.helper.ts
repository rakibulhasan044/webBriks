import {
  PaginateParams,
  PaginateResult,
} from '../decorators/paginate.decorator';

export class PaginateHelper {
  static response<T>(
    data: T[],
    total: number,
    { page, limit }: Pick<PaginateParams, 'page' | 'limit'>,
  ): PaginateResult<T> {
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }
}
