import { useState } from 'react';

const Generator = () => {
  const [ipsumText, setIpsumText] = useState('keyword ipsum');
  const [paragraphCount, setParagraphCount] = useState(2);

  const handleSubmit = (e) => {
    e.preventDefault();

    setIpsumText()

  }

  return (
    <div>
      <form
        className="form flex flex-row gap-2 py-2 mx-auto"
        onSubmit={handleSubmit}
      >
        <div className="form-control max-w-xs text-black">
          <label className="label">
            <span className="label-text">Keywords</span>
          </label>
          <input
            type="text"
            placeholder="awesome, radical, sick"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="form-control max-w-xs">
          <label className="label">
            <span className="label-text">Paragraphs</span>
          </label>
          <input
            type="number"
            min={1}
            value={paragraphCount}
            onChange={(e) => setParagraphCount(e.target.value)}
            className="input input-bordered w-full max-w-xs text-black"
          />
        </div>
        <button className="btn btn-primary self-end">Make My Ipsum</button>
        <button className="btn btn-secondary self-end">Copy My Ipsum</button>
      </form>
      <div className="form-control w-full">
        <textarea
          className="textarea textarea-bordered text-black"
          placeholder={ipsumText}
        ></textarea>
      </div>
    </div>
  );
};
export default Generator;
