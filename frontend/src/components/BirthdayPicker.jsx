import React from "react";
import Picker from "react-mobile-picker";
import "../style/BirthdayPicker.css";

function BirthdayPicker({ value, onChange }) {
  const days = Array.from({ length: 31 }, (_, i) => `${i + 1}`);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const years = Array.from({ length: 100 }, (_, i) => `${new Date().getFullYear() - i}`);

  return (
    <div className="birthday-picker">
      <Picker value={value} onChange={onChange} wheelMode="natural">
        <Picker.Column name="day">
          {days.map(d => (
            <Picker.Item key={d} value={d}>{d}</Picker.Item>
          ))}
        </Picker.Column>
        <Picker.Column name="month">
          {months.map(m => (
            <Picker.Item key={m} value={m}>{m}</Picker.Item>
          ))}
        </Picker.Column>
        <Picker.Column name="year">
          {years.map(y => (
            <Picker.Item key={y} value={y}>{y}</Picker.Item>
          ))}
        </Picker.Column>
      </Picker>
    </div>
  );
}

export default BirthdayPicker;