import { newSpecPage } from '@stencil/core/testing';
import { AdditionalQuestionsDetails } from "../additional-questions-details";
import { Business, IBusiness } from '../../../../api/Business';
import mockedBusinessDetails from '../../../../api/mockData/mockBusinessDetails.json';

describe('additional-questions-details', () => {
  it('should render additional-questions-details', async () => {
    const businessDetails = new Business(mockedBusinessDetails.data as unknown as IBusiness);

    const page = await newSpecPage({
      components: [AdditionalQuestionsDetails],
      html: (`
        <additional-questions-details></additional-questions-details>
      `),
    });

    page.rootInstance.additionalQuestions = businessDetails.additional_questions;

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });
});
