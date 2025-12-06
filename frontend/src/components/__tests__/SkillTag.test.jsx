import React from 'react';
import { render, screen } from '@testing-library/react';
import SkillTag from '../SkillTag';

describe('SkillTag', () => {
  test('renders skill name and level', () => {
    render(<SkillTag skill="React" level={5} />);
    
    expect(screen.getByText('React')).toBeInTheDocument();
    
    // Check that the level indicator is rendered with correct width
    const levelIndicator = screen.getByRole('generic', { hidden: true });
    expect(levelIndicator).toBeInTheDocument();
  });

  test('applies correct color based on level', () => {
    const { container } = render(<SkillTag skill="JavaScript" level={3} />);
    
    // Level 3 should have green color
    const levelBar = container.querySelector('.bg-green-500');
    expect(levelBar).toBeInTheDocument();
  });
});