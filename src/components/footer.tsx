export default function Footer() {
  return (
    <footer className='bg-primary text-primary-foreground py-4'>
      <div className='container mx-auto flex flex-col items-center justify-between px-4 md:flex-row'>
        <p className='mb-2 text-center md:mb-0'>
          For any inquiries or feedback, please reach out to us at{' '}
          <a
            href='mailto:mdizaan67@gmail.com'
            className='text-blue-100 hover:underline'
          >
            mdizaan67@gmail.com
          </a>
        </p>
        <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4'>
          <a href='/tnc' className=' hover:underline'>
            Terms and Conditions
          </a>
          <a href='privacy-policy' className=' hover:underline'>
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
