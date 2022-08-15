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
    });

    return this.companyRepository.save(company);
  }

  findAll() {
    return this.companyRepository.find();
  }

  findOne(id: number) {
    return this.companyRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Company (id: ${id}) not found.`);
    }

    return {
      message: `Company (id: ${id}) was deleted.`,
    };
  }
}
