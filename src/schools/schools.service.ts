import { Injectable } from '@nestjs/common';

@Injectable()
export class SchoolsService {
  async getSchools() {
    // Return mock schools data for now
    // In a real application, this would come from a database
    return {
      success: true,
      data: [
        {
          id: '65b0e6293e9f76a9694d84b4',
          name: 'Demo School',
          address: '123 Education Street, Learning City',
          contact: '+1-234-567-8900',
          email: 'admin@demoschool.edu'
        },
        {
          id: '65b0e6293e9f76a9694d84b5',
          name: 'Sample Academy',
          address: '456 Knowledge Avenue, Study Town',
          contact: '+1-234-567-8901',
          email: 'info@sampleacademy.edu'
        }
      ]
    };
  }
}


