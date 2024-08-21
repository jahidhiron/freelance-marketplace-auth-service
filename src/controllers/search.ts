import { gigById, gigsSearch } from '@auth/services/search.service';
import { Request, Response } from 'express';
import { sortBy } from 'lodash';
import { StatusCodes } from 'http-status-codes';

export async function gigs(req: Request, res: Response): Promise<void> {
  const { from, size, type } = req.params;
  let resultHits: unknown[] = [];
  const paginate = { from, size: parseInt(`${size}`), type };

  const gigs = await gigsSearch(
    `${req.query.query}`,
    paginate,
    `${req.query.deliveryTime}`,
    parseInt(`${req.query.minPrice}`),
    parseInt(`${req.query.maxPrice}`)
  );

  for (const item of gigs.hits) {
    resultHits.push(item._source);
  }

  if (type === 'backward') {
    resultHits = sortBy(resultHits, ['sortId']);
  }

  res.status(StatusCodes.OK).json({ message: 'Search gigs results', total: gigs.total, gigs: resultHits });
}

export async function singleGigById(req: Request, res: Response): Promise<void> {
  const gig = await gigById('gigs', req.params.gigId);

  res.status(StatusCodes.OK).json({ message: 'Signle gig result', gig });
}
