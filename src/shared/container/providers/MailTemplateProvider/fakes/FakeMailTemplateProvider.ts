import IMailTemplateProvider from '../models/IMailTemplateProvider';

class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parse() {
    return 'Mail content';
  }
}

export default FakeMailTemplateProvider;
