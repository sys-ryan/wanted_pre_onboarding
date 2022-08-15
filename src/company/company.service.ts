import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const company = await this.companyRepository.create({
      name: createCompanyDto.name,
      country: createCompanyDto.country,
      region: createCompanyDto.region,
    });

    return this.companyRepository.save(company);
  }

  findAll() {
    return this.companyRepository.find();
  }

  async findOne(id: number) {
    const company = await this.companyRepository.findOne({ where: { id } });

    if (!company) {
      throw new NotFoundException(`Company (id: ${id}) was not found.`);
    }

    return company;
  }

  async remove(id: number) {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Company (id: ${id}) not found.`);
    }

    await this.companyRepository.remove(company);

    return {
      message: `Company (id: ${id}) was deleted.`,
    };
  }
}
